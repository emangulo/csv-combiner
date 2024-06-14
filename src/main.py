import os

def get_all_files(dir_path):
    all_files = []
    for root, _, files in os.walk(dir_path):
        for file in files:
            all_files.append(os.path.join(root, file))
    return all_files

def combine_text_files(input_folder, output_file, name_filter):
    all_files = get_all_files(input_folder)
    text_files = [file for file in all_files if file.lower().endswith('.csv') and name_filter in file]

    if not text_files:
        print(f'No CSV files found in the directory and its subdirectories with "{name_filter}" in the title.')
        return

    combined_data = ""
    total_input_lines = 0

    for file in text_files:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                data = f.read()
                input_lines = len([line for line in data.split('\n') if line.strip()])
                total_input_lines += input_lines

                combined_data += data if data.endswith('\n') else data + '\n'
        except Exception as e:
            print(f'Error reading file {file}: {e}')

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(combined_data)
        print(f'Combined text file created at {output_file}')

        total_output_lines = len([line for line in combined_data.split('\n') if line.strip()])
        if total_input_lines == total_output_lines:
            print(f'Line count verification passed: {total_input_lines} lines.')
        else:
            print(f'Line count verification failed: {total_input_lines} input lines, but {total_output_lines} output lines.')
    except Exception as e:
        print(f'Error writing to file {output_file}: {e}')

