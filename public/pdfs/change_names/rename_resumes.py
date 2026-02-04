import os
import re

def extract_name_from_filename(filename):
    """
    Extract name from filename using various patterns.
    Returns (first_name, last_name) tuple or None.
    """
    # Remove .pdf extension
    name = filename.replace('.pdf', '').replace('.PDF', '')
    
    # Remove " - " suffix pattern if exists (like "Abbasi_Wania_Cover_Letter - Wania Abbasi")
    if " - " in name:
        name = name.split(" - ")[0]
    
    # Pattern 1: Already in correct format "Lastname_Firstname_Cover_Letter" or "Lastname_Firstname_CoverLetter"
    match = re.match(r'^([A-Za-z-]+)_([A-Za-z-_ ]+?)_Cover_?Letter$', name, re.IGNORECASE)
    if match:
        last_name = match.group(1).strip()
        first_name = match.group(2).replace('_', ' ').strip()
        return (first_name, last_name)
    
    # Pattern 2: "Firstname_Lastname_Cover_Letter" format
    match = re.match(r'^([A-Za-z-_ ]+?)_([A-Za-z-]+)_Cover_?Letter$', name, re.IGNORECASE)
    if match:
        first_part = match.group(1).replace('_', ' ').strip()
        second_part = match.group(2).strip()
        
        # Check if first_part has multiple words (compound first name)
        first_words = first_part.split()
        if len(first_words) > 1:
            # Likely "First Middle_Last_Cover_Letter"
            return (first_part, second_part)
        else:
            # Simple "First_Last_Cover_Letter"
            return (first_part, second_part)
    
    # Pattern 3: "Firstname Lastname Cover Letter" (with spaces)
    match = re.match(r'^([A-Za-z-_ ]+)Cover_?Letter$', name, re.IGNORECASE)
    if match:
        name_part = match.group(1).replace('_', ' ').strip()
        parts = name_part.split()
        if len(parts) >= 2:
            if len(parts) == 2:
                return (parts[0], parts[1])
            else:
                # Multiple words: treat last as last name
                return (' '.join(parts[:-1]), parts[-1])
    
    # Pattern 4: General cleanup - remove common keywords
    name_clean = re.sub(r'[-_]', ' ', name)
    name_clean = re.sub(r'\b(cover|letter|coverletter|cl)\b', '', name_clean, flags=re.IGNORECASE).strip()
    name_clean = ' '.join(name_clean.split())  # Clean up extra spaces
    
    parts = name_clean.split()
    
    if len(parts) >= 2:
        if len(parts) == 2:
            return (parts[0], parts[1])
        elif len(parts) == 3:
            # Could be "First Middle Last" - assume first is first name, last is last name
            return (parts[0], parts[-1])
        elif len(parts) >= 4:
            # Multiple words like "Mohammad Hussain Mohamed Ali Khan"
            # Assumption: Last word is last name, rest is first name
            return (' '.join(parts[:-1]), parts[-1])
    
    return None

def prompt_for_name(filename):
    """
    Ask user to manually input the name for a file.
    Returns (first_name, last_name) tuple or None to skip.
    """
    print(f"\n⚠ Could not identify name from: {filename}")
    print("Please enter the candidate's name manually:")
    first_name = input("  First name (or 'skip' to delete file): ").strip()
    
    if first_name.lower() == 'skip':
        return None
    
    last_name = input("  Last name: ").strip()
    
    if first_name and last_name:
        return (first_name, last_name)
    else:
        print("  Invalid input. File will be skipped.")
        return None

def rename_cover_letter_files(folder_path, auto_mode=False):
    """
    Intelligently rename cover letter files to Lastname_Firstname_Cover_Letter.pdf format.
    Deletes non-PDF files.
    
    Args:
        folder_path: Path to folder containing cover letters
        auto_mode: If True, skip files that can't be auto-identified (don't prompt)
    """
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist.")
        return
    
    # Get all files
    all_files = os.listdir(folder_path)
    
    print(f"Found {len(all_files)} files.\n")
    
    # First, delete non-PDF files
    deleted_count = 0
    for filename in all_files:
        if not filename.lower().endswith('.pdf'):
            file_path = os.path.join(folder_path, filename)
            try:
                os.remove(file_path)
                print(f"🗑 Deleted non-PDF: {filename}")
                deleted_count += 1
            except Exception as e:
                print(f"✗ Error deleting {filename}: {str(e)}")
    
    if deleted_count > 0:
        print(f"\nDeleted {deleted_count} non-PDF files.\n")
    
    # Get PDF files only
    pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
    
    print(f"Processing {len(pdf_files)} PDF files...\n")
    
    renamed_count = 0
    skipped_count = 0
    
    for filename in pdf_files:
        try:
            file_path = os.path.join(folder_path, filename)
            
            # Try to extract name from filename
            name_tuple = extract_name_from_filename(filename)
            
            # If still no name found, prompt user (unless auto_mode)
            if name_tuple is None:
                if auto_mode:
                    print(f"⊘ Skipped (could not identify): {filename}")
                    skipped_count += 1
                    continue
                else:
                    name_tuple = prompt_for_name(filename)
                    if name_tuple is None:
                        print(f"🗑 Deleting: {filename}")
                        os.remove(file_path)
                        deleted_count += 1
                        continue
            
            first_name, last_name = name_tuple
            
            # Handle multi-word names (replace spaces with underscores)
            first_name_formatted = first_name.replace(' ', '_')
            last_name_formatted = last_name.replace(' ', '_')
            
            # Create new filename
            new_filename = f"{last_name_formatted}_{first_name_formatted}_Cover_Letter.pdf"
            new_path = os.path.join(folder_path, new_filename)
            
            # Check if already correct
            if filename == new_filename:
                print(f"✓ Already correct: {filename}")
                continue
            
            # Check if new filename already exists
            if os.path.exists(new_path):
                print(f"⚠ Warning: {new_filename} already exists. Skipping {filename}")
                skipped_count += 1
                continue
            
            # Rename the file
            os.rename(file_path, new_path)
            print(f"✓ Renamed: {filename}")
            print(f"      → {new_filename}\n")
            renamed_count += 1
            
        except Exception as e:
            print(f"✗ Error processing {filename}: {str(e)}")
            skipped_count += 1
    
    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  ✓ Renamed: {renamed_count}")
    print(f"  ⊘ Skipped: {skipped_count}")
    print(f"  🗑 Deleted: {deleted_count}")
    print(f"{'='*50}")

# Usage
if __name__ == "__main__":
    print("=" * 50)
    print("COVER LETTER FILE RENAMING TOOL")
    print("=" * 50)
    print("This script will:")
    print("  1. Delete all non-PDF files")
    print("  2. Rename PDFs to Lastname_Firstname_Cover_Letter.pdf")
    print("  3. Extract names from various filename patterns")
    print("=" * 50)
    
    folder_path = input("\nEnter folder path: ").strip().strip('"').strip("'")
    
    mode = input("\nAuto mode? (y/n) [y=skip unidentified files, n=prompt for names]: ").strip().lower()
    auto_mode = mode == 'y'
    
    print(f"\nProcessing files in: {folder_path}\n")
    rename_cover_letter_files(folder_path, auto_mode)
