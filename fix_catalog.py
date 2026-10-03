def fix():
    with open('retrace_django/device_catalog_data.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace JS comments with Python comments
    content = content.replace('//', '#')
    
    with open('retrace_django/device_catalog_data.py', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix()
