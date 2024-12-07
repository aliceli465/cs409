import re
from collections import defaultdict
import json

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
        function_pattern = re.compile(r'\b[A-Za-z_]\w*\s+\*?\b([A-Za-z_]\w*)\s*\([^)]*\)\s*{')
        return function_pattern.findall(file_content)

    def extract_function_calls(function_body, defined_functions):
        """
        Extract function calls from the function body, excluding reserved keywords.
        """
        reserved_keywords = {'if', 'for', 'while', 'return', 'switch', 'case', 'break', 'continue', 'else', 'sizeof'}
        
        # Regex pattern for function calls
        call_pattern = re.compile(r'\b([A-Za-z_]\w*)\s*\(')
        all_calls = call_pattern.findall(function_body)
        
        # Filter out reserved keywords and keep valid function calls
        return [call for call in all_calls if call in defined_functions and call not in reserved_keywords]

    def extract_function_body(file_content, func_name):
        """
        Extract the full function body by counting braces to handle nested blocks.
        """
        # Search for the function definition (e.g., `void main()`), and find the opening `{`
        func_pattern = re.compile(rf'\b{func_name}\s*\([^)]*\)\s*{{')
        func_match = func_pattern.search(file_content)
        
        if not func_match:
            return ""

        start_index = func_match.end()  # The start index is right after the opening brace
        
        # Now, we need to find the matching closing brace
        open_braces = 1  # We already found one opening brace
        end_index = start_index
        while open_braces > 0 and end_index < len(file_content):
            if file_content[end_index] == '{':
                open_braces += 1
            elif file_content[end_index] == '}':
                open_braces -= 1
            end_index += 1
        
        # Extract and return the function body
        return file_content[start_index:end_index - 1]  # Exclude the final closing brace

    with open(file_name, 'r') as file:
        file_content = file.read()

    # Remove comments (both single-line and multi-line)
    file_content = re.sub(r'//.*|/\*.*?\*/', '', file_content, flags=re.DOTALL)

    # Extract function definitions
    defined_functions = extract_function_definitions(file_content)

    # Initialize the dependency graph
    dependency_graph = defaultdict(list)

    # Extract function bodies and find calls
    for func in defined_functions:
        body_content = extract_function_body(file_content, func)
        calls = extract_function_calls(body_content, defined_functions)
        dependency_graph[func].extend(calls)

    return dict(dependency_graph)

# Example usage
file_name = r"test_c_files/test.c"  # Replace with your file name
dependency_graph = build_function_dependency_graph_from_file(file_name)

# Write the graph to a JSON file
filename = "test_graph.json"
with open(filename, 'w') as json_file:
    json.dump(dependency_graph, json_file, indent=4)

# Print the dependency graph
print("Function Dependency Graph:")
for func, calls in dependency_graph.items():
    print(f"{func}:")
    for call in calls:
        print(f"  -> {call}")
