import re

def convert():
    with open('src/server/deviceCatalogData.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove export const
    content = content.replace('export const DEVICE_TYPES', 'DEVICE_TYPES')
    content = content.replace('export const DEVICE_CATALOG', 'DEVICE_CATALOG')
    
    # The findDeviceByTAC function will be written separately, so cut the content there
    end_idx = content.find('export function findDeviceByTAC')
    if end_idx != -1:
        content = content[:end_idx]
    
    # Add quotes to unquoted keys
    # Match an identifier followed by a colon
    content = re.sub(r'^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'    "\1":', content, flags=re.MULTILINE)
    
    python_code = content + '''
def find_device_by_tac(tac):
    if not tac or not isinstance(tac, str):
        return None
    clean_tac = tac.strip()
    for device in DEVICE_CATALOG:
        prefixes = device.get('tacPrefixes')
        if not prefixes or not isinstance(prefixes, list):
            continue
        for prefix in prefixes:
            if clean_tac.startswith(prefix) or prefix.startswith(clean_tac):
                return device
    return None
'''
    with open('retrace_django/device_catalog_data.py', 'w', encoding='utf-8') as f:
        f.write(python_code)

if __name__ == "__main__":
    convert()
