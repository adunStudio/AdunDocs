## 가장 기본적인 조건제어문은 do while 입니다

가령
int a = 0;
do a++; while( a < 10 );

위 같은 코드는 실제로는 다음과 같이 번역됩니다.
어셈블리 코드로 적으면 낯설테니 그냥 pseudo code로.

a <- 0;
loop:
    a <- a + 1
    if( a < 10 )
        goto loop;

만약

int a;
for( a = 0; a < 10; ++a );

와 같은 코드를 작성하면,
컴파일러가 최적화 하지 않는 경우 다음과 같은 코드로 번역됩니다.

a <- 0;
loop:
    if ( a >= 10 )
        goto next;
    a <- a + 1
    goto loop;
next:

차이를 아시겠어요?
do ~ while 은 3줄짜리 코드. ( 루프의 반복회수가 N 일 때 complexity 3N )
for는 4줄짜리가 됩니다. ( 루프의 반복회수가 N 일때 complexity 4N, 즉 25% 성능차이 )

하지만 컴파일러는 시작 초기화값 상수 0 이 10보다 작다는걸 알기 때문에
최적화를 걸면 for 문을 do ~ while 로 해석해서
세 줄짜리 코드를 만들어 줍니다.

do-while 을 안쓰다뇨.
루프에 들어갈때 조건을 판단하는거랑,
일단 실행하고 루프를 빠져나갈때 조건을 판단하는 구조는
명령어 1개 만큼의 최적화 영향을 받게 됩니다.
```cpp
// str 이 char* 타입일때
while( *str++ ); 과
while( *str ) str++;

의 차이점도 아셔야 합니다.

전자는 null 문자를 만나고 나서 빠져나올때 하나 더 str 을 증가시키게 됩니다.
후자는 null 문자를 만난 위치에 포인터가 멈춰서게 되죠.
저걸 pseudo 코드로 나열하면, 다시 명령어 하나가 루프안에 더 있고 없고의 차이가 됩니다.
컴파일 되고 나면 *str++ 을 사용한쪽이 반복문 안에서의 명령어가 하나 적게 되기에

size_t strlen( const char* str )
{
    char* ptr = (char*)str;
    while( *ptr++ );
    return ptr - str - 1;
}

이게

while( *ptr ) ptr++; 를 사용해서
return ptr - str; 하는 코드보다 효율적인 코드가 됩니다.

request 를 받아 위의 두 예도 pseudo code 를 작성합니다.
단, 이경우 if 문 형식과 어셈블리 코드가 조금 달라지니
최대한 x86 instruction 에 맞춰 비교구문을 test 라고 하겠습니다.

1. while( *ptr++ ); 의 경우

loop:
    result_flag << test( *ptr, 0 );
    ptr <- ptr + 1;
    if( result_flag.contains( not_zero ) ) goto loop;


2. while( *ptr ) ptr++; 의 경우

loop:
    result_flag << test( *ptr, 0 );
    if( result_flag.contains( zero ) ) goto next;
    ptr <- ptr + 1;
    goto loop;
next:
```
위와같이 3줄 명령어 루프와 4줄 명령어 루프가 됩니다.
