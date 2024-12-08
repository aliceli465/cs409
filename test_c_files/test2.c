#include <stdio.h>

void print_message(char *msg) {
    printf("%s\n", msg);
}

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

void calculations(int x, int y) {
    int sum = add(x, y);
    int product = multiply(x, y);

    printf("Sum: %d, Product: %d\n", sum, product);
}

void main() {
    print_message("Starting program...");
    calculations(3, 5);
    print_message("Program completed.");
}
