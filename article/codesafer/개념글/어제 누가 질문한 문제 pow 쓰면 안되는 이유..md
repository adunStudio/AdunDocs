1. double 의 표현범위는 가수부 정확도를 무시하고 10의 308승 정도다.
    - 당연히 문제는 100의 100만승 의 범위를 이야기 하니까. double 을 이용하는 pow 따위 노답.

2. 각 진법의 곱셈은 제일 아랫자리의 순환으로 수렴된다. 문제의 특수성을 이해하는게 중요.

즉,
pow 는 일반해
표현범위는 일반론의 한계
끝자리 순환은 특수해를 위한 특징

대략
```
#include <iostream>

#define rigid                   constexpr
#define countof( arr )          ( sizeof arr / sizeof *arr )

using   uu                      = std::size_t;

using   namespace   std;

const   uu      radix = 10; // 진법

inline  auto    count_of_suffixes( const uu a ) // 순환 길이 측정 O( log radix )
{
    uu  ret = a;
    uu  len = 0;

    do  ret = ret * a % radix, len++; while( ret != a );

    return  len;
}

inline  auto suffix_of_pow( const uu a, const uu b ) // a ^ b 표현의 각 진법 마지막 자리 구하기 O( 1 )
{
    const   uu  suffix_a = a % radix;
    const   uu  count = ( b - 1 ) % count_of_suffixes( suffix_a );

    uu  ret = suffix_a;
    for( uu i = 0; i < count; ++i )
        ret = ret * suffix_a % radix;

    return  ret ? ret : radix;
}

대략 이런식으로 설명되는데,
이 순환 패턴을 상수로 작성하면 O( 1 ) 이 된다.

rigid   uu  suffixes0[] = { 0, };
rigid   uu  suffixes1[] = { 1, };
rigid   uu  suffixes2[] = { 2, 4, 8, 6, };
rigid   uu  suffixes3[] = { 3, 9, 7, 1, };
rigid   uu  suffixes4[] = { 4, 6, };

rigid   uu  suffixes5[] = { 5, };
rigid   uu  suffixes6[] = { 6, };
rigid   uu  suffixes7[] = { 7, 9, 3, 1, };
rigid   uu  suffixes8[] = { 8, 4, 2, 6, };
rigid   uu  suffixes9[] = { 9, 1, };

이렇게 10진법 지수표현의 각 밑수 기준 순환테이블을 만들고,

template< class T >
struct                          ARRAY
{
    const   T*                  items;
    const   uu                  size;
    const   T&                  operator[]( const uu index ) const
    {
        return items[ index % size ];
    }
};

이런식으로 낱개의 서로 다른 길이의 배열을 하나로 묶어줄 wrapper 를 만든 뒤,

#define itm_( n )               { suffixes##n, countof( suffixes##n ), }
rigid ARRAY< uu > suffixes_list[] =
{
    itm_(0), itm_(1), itm_(2), itm_(3), itm_(4),
    itm_(5), itm_(6), itm_(7), itm_(8), itm_(9),
};
#undef  itm_

이렇게 하나의 배열로 묶어주면 되지.

inline  auto    suffix_of_pow( const uu a, const uu b )
{
    auto    ret = suffixes_list[ a % radix ][ b - 1 ];
    return  ret ? ret : radix;
}
```
이렇게 불러주면 되는것. 완전한 O( 1 ) 이지?

그런데, 순환 배열 상수를 저렇게 암산하는건 아름다운 케이스가 아니지.
다른 진법에서 일일이 계산하기도 귀찮고 말야.

그러니,
```
template< uu... ns >
struct                          seq // template variadic parameter 를 수열로 처리하는 구조체 
{
    static  rigid   auto        size()
    {
     return  sizeof...( ns );
    }

    static  rigid   auto        to_array()
    {
        return  std::array< uu, size() > { ns... };
    }
};

template< uu n, uu radix = 10 >
struct                          suffix // 자동으로 끝자리 순환 배열을 만드는 구조체
{
    template< uu s, uu... ns >
    struct                      make : make< s * n % radix, ns..., s % radix > {};

    template< uu... ns >
    struct                      make< n, ns... > : seq< n, ns... > {};

    static  rigid   auto        to_array()
    {
        return  make< n * n >::to_array();
    }
};
```
실제로 10개에 대해 만들자.
```
#define itm_( n )               { (const uu*)&suffixes##n, suffixes##n.size(), }
rigid ARRAY< uu > suffixes_list[] =
{
    itm_(0), itm_(1), itm_(2), itm_(3), itm_(4),
    itm_(5), itm_(6), itm_(7), itm_(8), itm_(9),
};
#undef  itm_
```
끝~.

모든 경험은 재사용될 수 있게 코드로 옮겨져야 한다. ( 짬날때 일반화 하자. 그게 니 미래다 )