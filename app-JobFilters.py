from src.main import combine_text_files

input_folder = "./input"
name_filter = "JobFilters"  # "" or JobFilters or Jobs
output_file = f"./output/output-{name_filter}.csv"

combine_text_files(input_folder, output_file, name_filter)
