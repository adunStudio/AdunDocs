## C 언어 for 문 반복 비용에 관한 소고

![이미지](http://dcimg1.dcinside.com/viewimage.php?id=3dafdf21f7d335ab67b1d1&no=29bcc427b38577a16fb3dab004c86b6fb8c469a51a456a5787032fed780bd3a41127dc7a693301829f6ec5a1a9452a0743467248a29d5277fb608ab9f5)
volatile int var = 1;
for( int i = 0; i < loop_count; ++i )
    var += var;

N 번 iteration 하는 for 문 안에서 volatile 로 선언된 변수의 var += var 를 수행한 결과 그래프.
역시 내가 만든 benchmark 환경은 깔끔한 그래프가 나온다. 히힣.

추세선의 수식이 clocks( loop_count ) = 5.8 * loop_count - 68 의 형태로 계산되고 있다.
-68 이 나오는 이유는 rdtsc 명령을 수행하면서 파이프라인과 스칼라에 묻힌 것. 무시하면 된다.

0 에서 시작하는 기본 for 루프는 시작값과 반복조건 모두 상수인 경우는 3개의 명령으로 구성되지만
지금은 loop_count 가 변수기 때문에 내부적으로 4개 명령어 조합으로 이루어진다.

여기서 volatile 변수를 다루므로 값을 가지고 오고 다시 저장해야하기 때문에
load, add, store 가 추가되어 7개 정도의 명령을 루프에서 수행하게 될것이다.

disassemble 해보진 않았지만 대략 다음과 유사한 구조겠지.

loop_top:
1. cmp iterator, loop_count //
2. je loop_end              // for 는 진입 제어문

3. mov eax, [&var]          // load var
4. add eax, eax             // adder
5. mov [&var], eax          // store var

6. inc iterator
7. jmp loop_top
loop_end:

여기서
1 ~ 2 사이에는 cmp 결과가 write back 되는걸 기다려야 하니까 data dependency 존재.
3 ~ 4, 4 ~ 5 사이에도 dependency 존재.
6 ~ 1 사이에 dependency가 걸려 있게 된다. ( 어차피 jmp 에 의해 초기화 되지만 )

즉 병렬화 가능한 부분은 2 ~ 3, 5 ~ 6, 6 ~ 7 사이밖에 없다.
모두 최적화 된다면 단일 파이프라인 기준 7 - 3 = 4 클럭이 소요되어야 하지만,
cache expire 에 의해 var 값을 새로 읽어오는 과정은 루프에 다른 명령들이 충분히 있으니까 묻히겠고
jmp(7.), cmp(1.), je(2.), 도합 세 개의 명령에 부가적인 작업이 발생했고
4.8 클럭이 소요되었을 것이라 생각된다. ( 대략 1.6 * 3 )

4 + ( 4.8 - 3 ) = 5.8
