import os

def load_file(filename):
    # Get the directory of the current script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the absolute path to the file
    file_path = os.path.join(base_dir, filename)
    with open(file_path, "r") as file:
        return file.read()