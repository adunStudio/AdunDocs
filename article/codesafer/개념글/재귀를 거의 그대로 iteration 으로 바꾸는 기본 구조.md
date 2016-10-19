## 재귀를 거의 그대로 iteration 으로 바꾸는 기본 구조
```cpp
#include <iostream>

using   namespace   std;

int run_ladder( int level = 0, int index = 0 )
{
    if( level >= 4 ) return 1;
    index += ++level;    
    return run_ladder( level, index ) + run_ladder( level, index + 1 );
}

int run_ladder_iteration()
{
    static  char    output[6];
    typedef struct
    {
        int level,  index;
    };
    CONTEXT;
    CONTEXT     stack[5], now;
    int         sp = 1;
    int         result = 0;
    stack[0] = { 0, 0 };

    while( sp )
    {
        now = stack[--sp];
        while( 1 )
        {
            output[ now.level ] = 'A' + now.index;
            if( now.level >= 4 )
            {
                cout << output << endl;
                break;
            }
            now.index += ++now.level;
            stack[sp++] = { now.level, now.index + 1 };
        }
        result++;
    }
    return result;
}


int main()
{
    cout << run_ladder() << endl;
    cout << run_ladder_iteration() << endl;
    return 0;
}
```
한심한 문제.
