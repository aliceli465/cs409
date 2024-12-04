import re
import json

def extract_functions_with_body(c_code):
    function_pattern = re.compile(
        r'([a-zA-Z_][a-zA-Z0-9_]*\s+\**\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\))\s*{([^{}]*({[^{}]*})*[^{}]*)}',
        re.DOTALL
    )

    functions = []
    for match in function_pattern.findall(c_code):
        header = match[0].strip()
        body = match[1].strip()

        functions.append({
            "Header": header,
            "Body": body
        })
    return functions
