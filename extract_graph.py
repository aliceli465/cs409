import re
from collections import defaultdict

def build_function_dependency_graph_from_file(file_name):
    """
    Build a dependency graph of function calls in a C file.
    
    Parameters:
        file_name (str): The name of the C file to analyze.
    
    Returns:
        dict: A dictionary representing the function dependency graph, where keys
              are function names and values are lists of functions they call.
    """
    def extract_function_definitions(file_content):
        """
        Extract function definitions from the file content.
        """
        function_pattern = re.compile(r'\b[A-Za-z_]\w*\s+\*?\b([A-Za-z_]\w*)\s*\([^;]*\)\s*{')
        return function_pattern.findall(file_content)

    def extract_function_calls(file_content, defined_functions):
        """
        Extract function calls from the file content.
        """
        call_pattern = re.compile(r'\b([A-Za-z_]\w*)\s*\(')
        all_calls = call_pattern.findall(file_content)
        return [call for call in all_calls if call in defined_functions]

    with open(file_name, 'r') as file:
        file_content = file.read()

    # Remove comments (both single-line and multi-line)
    file_content = re.sub(r'//.*|/\*.*?\*/', '', file_content, flags=re.DOTALL)

    # Extract function definitions
    defined_functions = extract_function_definitions(file_content)

    # Initialize dependency graph
    dependency_graph = defaultdict(list)

    # Extract function bodies and find calls
    for func in defined_functions:
        body_pattern = re.compile(rf'\b{func}\s*\([^)]*\)\s*{{(.*?)}}', re.DOTALL)
        match = body_pattern.search(file_content)
        if match:
            body_content = match.group(1)
            calls = extract_function_calls(body_content, defined_functions)
            dependency_graph[func].extend(calls)

    return dict(dependency_graph)

# file_name = r"C:\Users\Namea\OneDrive\Desktop\cs409\camelCaser.c"  # Replace with your file name
# dependency_graph = build_function_dependency_graph_from_file(file_name)

# print(dependency_graph.items())
# # Print the dependency graph
# print("Function Dependency Graph:")
# for func, calls in dependency_graph.items():
#     print(f"{func}:")
#     for call in calls:
#         print(f"  -> {call}")
