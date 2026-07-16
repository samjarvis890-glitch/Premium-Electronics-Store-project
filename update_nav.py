import os
import glob
import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract Navbar from index.html
nav_start = index_content.find('<nav id="navbar"')
if nav_start == -1:
    print("Could not find nav start in index.html")
    exit(1)
nav_end = index_content.find('</nav>', nav_start) + len('</nav>')
index_nav = index_content[nav_start:nav_end]

# Extract Footer from index.html
footer_start = index_content.find('<footer')
if footer_start == -1:
    print("Could not find footer start in index.html")
    exit(1)
footer_end = index_content.find('</footer>', footer_start) + len('</footer>')
index_footer = index_content[footer_start:footer_end]

html_files = glob.glob('*.html')
for file in html_files:
    if file == 'index.html':
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace navbar
    file_nav_start = content.find('<nav id="navbar"')
    if file_nav_start != -1:
        file_nav_end = content.find('</nav>', file_nav_start) + len('</nav>')
        content = content[:file_nav_start] + index_nav + content[file_nav_end:]
    
    # Replace footer
    file_footer_start = content.find('<footer')
    if file_footer_start != -1:
        file_footer_end = content.find('</footer>', file_footer_start) + len('</footer>')
        content = content[:file_footer_start] + index_footer + content[file_footer_end:]
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Successfully updated navbar and footer in all HTML files.")
