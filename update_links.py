import os
import glob
import re

html_files = glob.glob('*.html')

link_map = {
    'Home 1': 'index.html',
    'Home 2': 'home2.html',
    'Home': 'index.html',
    'About': 'about.html',
    'Products': 'products.html',
    'Categories': 'categories.html',
    'Brands': 'brands.html',
    'Deals': 'deals.html',
    'Accessories': 'accessories.html',
    'Gallery': 'gallery.html',
    'Blog': 'blog.html',
    'Contact': 'contact.html',
    'Contact Us': 'contact.html',
    'Login': 'login.html',
    'Laptops': 'products.html',
    'Smartphones': 'products.html',
    'Smartwatches': 'products.html',
    'Headphones': 'products.html',
    'Gaming Accessories': 'accessories.html',
    'Smart Home': 'products.html',
    'Laptops & PCs': 'products.html',
    'Audio & Video': 'products.html',
}

def replace_link(match):
    before_href = match.group(1)
    after_href = match.group(2)
    inner_html = match.group(3)
    
    # Find the longest matching key to avoid partial matches
    best_match = None
    best_len = -1
    for key, url in link_map.items():
        if key in inner_html:
            if len(key) > best_len:
                best_len = len(key)
                best_match = url
                
    if best_match:
        return f'<a{before_href}href="{best_match}"{after_href}>{inner_html}</a>'
            
    # if no match, leave it
    return match.group(0)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    pattern = re.compile(r'<a([^>]*?)href="#"([^>]*?)>(.*?)</a>', re.IGNORECASE | re.DOTALL)
    
    new_content = pattern.sub(replace_link, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print("Updated all hyperlinks successfully!")
