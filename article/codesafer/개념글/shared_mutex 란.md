## shared_mutex 란

boost 에선 세가지 모드를 지원하는걸로 기억하는데,

stl 에서 제공하는 shared_mutex 는 upgradable 인가를 지원안할거임.
그래서 exclusive mode 랑 shared mode 두가지를 지원함.

한마디로, ( exclusive ) unique_lock 은 기존의 mutex 를 lock 하는것과 거의 같은 동작임.
누가 lock 을 걸었으면 걔가 풀때까지 자원에 접근할 수 없음.

shared_lock 을 걸면 shared_lock 을 건 쓰레드들끼리는 읽기 전용으로 접근한다는 약속하에 접근이 허가됨.

무슨 말인고 하니,

어떤 상점에 물건을 파는데, 구경은 공짜, 살 사람만 만지시오. 라고 써붙인 상황인것임.

1. 어떤 사람이 사려고 만지는 동안은 아무도 구경 못함. ( unique_lock 일때는 shared_lock 이 걸리지 않음 )
2. 구경하는 사람이 있을땐 구경은 할 수 있음 ( shared_lock 일때, 다른 쓰레드도 shared_lock 가능 )
3. 구경하는 사람이 있을땐 사지도 못함 ( shared_lock 일때, unique_lock 을 걸 수 없음 )
4. 당연하지만 사려는 사람이 만지는 동안은 다른 사람이 사려고 만질 수 없음 ( unique_lock 일때 unique_lock 을 걸 수 없음 )

즉, 읽기용 락은 복수가 가능하지만 읽기용 락중엔 쓰기용 락이 안됨.
쓰기용 락일 때는 추가로 읽기용 락도 안되고 쓰기용 락도 안됨.

수정등의 공유데이타 변경을 한 쓰레드에서만 하고 여러쓰레드에서는 읽기만 할때,
읽는 애들끼리 lock 의 방해를 주고 받지 않도록 유연성을 부여해 설계된 mutex 란거임.
