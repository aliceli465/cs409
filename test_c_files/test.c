#include <stdio.h>

void printf_hello() {
    printf("Hello, World!\n");
}

int is_prime(int num) {
    if (num <= 1) {
        return 0;
    }
    for (int i = 2; i < num; i++) {
        if (num % i == 0) {
            return 0;
        }
    }
    return 1;
}

void fibonacci(int n) {
    int a = 0, b = 1, next;
    for (int i = 0; i < n; i++) {
        printf("%d ", a);
        next = a + b;
        a = b;
        b = next;
    }
    printf("\n");
}

void main() {
    printf_hello();
    int num = 7;
    if (is_prime(num)) {
        printf("%d is prime\n", num);
    }
    fibonacci(5);
}
