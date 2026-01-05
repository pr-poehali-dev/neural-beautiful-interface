import json
import os
import requests

def handler(event: dict, context) -> dict:
    """
    AI чат - работает с Anthropic Claude и OpenAI GPT, автоматически выбирает доступный API
    Отвечает на любом языке пользователя
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        messages = body.get('messages', [])
        
        if not messages:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Сообщения не переданы'}),
                'isBase64Encoded': False
            }
        
        anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
        openai_key = os.environ.get('OPENAI_API_KEY')
        
        if not anthropic_key and not openai_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Не настроен ни один AI API ключ (ANTHROPIC_API_KEY или OPENAI_API_KEY)'}),
                'isBase64Encoded': False
            }
        
        system_prompt = """You are a polite and intelligent AI assistant.
Always respond respectfully, clearly, and helpfully.
Automatically detect the user's language from their messages and respond in the SAME language.
If user writes in Russian - respond in Russian.
If user writes in English - respond in English.
If user writes in Spanish, French, German, Chinese, Arabic, or any other language - respond in that language.
Be helpful, friendly, and professional.
If you don't know the answer - say so honestly, don't make things up."""
        
        ai_message = None
        usage = {}
        
        if anthropic_key:
            try:
                print('Trying Anthropic Claude API...')
                claude_messages = []
                for msg in messages:
                    if msg['role'] != 'system':
                        claude_messages.append({
                            'role': msg['role'],
                            'content': msg['content']
                        })
                
                response = requests.post(
                    'https://api.anthropic.com/v1/messages',
                    headers={
                        'x-api-key': anthropic_key,
                        'anthropic-version': '2023-06-01',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'claude-3-5-sonnet-20241022',
                        'max_tokens': 2000,
                        'system': system_prompt,
                        'messages': claude_messages
                    },
                    timeout=60
                )
                
                print(f'Anthropic response status: {response.status_code}')
                if response.status_code == 200:
                    data = response.json()
                    ai_message = data['content'][0]['text']
                    usage = {
                        'prompt_tokens': data.get('usage', {}).get('input_tokens', 0),
                        'completion_tokens': data.get('usage', {}).get('output_tokens', 0),
                        'total_tokens': data.get('usage', {}).get('input_tokens', 0) + data.get('usage', {}).get('output_tokens', 0)
                    }
                    print('Anthropic Claude API success!')
                else:
                    print(f'Anthropic error: {response.text}')
            except Exception as e:
                print(f'Anthropic exception: {str(e)}')
        
        if not ai_message and openai_key:
            try:
                print('Trying OpenAI GPT API...')
                full_messages = [{'role': 'system', 'content': system_prompt}] + messages
                
                response = requests.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {openai_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'gpt-4o-mini',
                        'messages': full_messages,
                        'temperature': 0.7,
                        'max_tokens': 2000
                    },
                    timeout=60
                )
                
                print(f'OpenAI response status: {response.status_code}')
                if response.status_code == 200:
                    data = response.json()
                    ai_message = data['choices'][0]['message']['content']
                    usage = data.get('usage', {})
                    print('OpenAI GPT API success!')
                else:
                    print(f'OpenAI error: {response.text}')
            except Exception as e:
                print(f'OpenAI exception: {str(e)}')
        
        if not ai_message:
            error_msg = 'Не удалось получить ответ от AI. '
            if anthropic_key and not openai_key:
                error_msg += 'Проверьте ANTHROPIC_API_KEY.'
            elif openai_key and not anthropic_key:
                error_msg += 'OpenAI заблокирован в России. Добавьте ANTHROPIC_API_KEY (работает без VPN).'
            else:
                error_msg += 'Проверьте оба ключа.'
            
            print(f'Error: {error_msg}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': error_msg}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': ai_message,
                'usage': usage
            }),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Некорректный JSON'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }