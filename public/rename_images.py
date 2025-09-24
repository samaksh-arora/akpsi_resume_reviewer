import os

# Folder where your images are stored
folder_path = "images"

# Allowed extensions
extensions = (".jpg", ".jpeg", ".png")

# Go through all files in the folder
for filename in os.listdir(folder_path):
    name, ext = os.path.splitext(filename)
    
    # Only process image files
    if ext.lower() not in extensions:
        continue
    
    # Split the name by spaces or underscores
    parts = name.replace("_", " ").split()
    
    if len(parts) >= 2:
        firstname = parts[0].lower()
        lastname = parts[1].lower()
    else:
        firstname = parts[0].lower()
        lastname = "lastname"  # default
    
    new_name = f"{firstname}-{lastname}{ext.lower()}"
    
    old_path = os.path.join(folder_path, filename)
    new_path = os.path.join(folder_path, new_name)
    
    os.rename(old_path, new_path)
    print(f"Renamed: {filename} → {new_name}")

print("✅ Done renaming!")
