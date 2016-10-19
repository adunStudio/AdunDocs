## getter, setter 를 쓰는이유 첨언

1. wrapper 는 분산된 사용처들을 위한
   수정해야 할 포인트를 한 곳으로 집중해 준다.
   일종의 gateway 다.

2. lvalue 로써의 접근과 rvalue 로써의 접근을
   추적가능케 해 준다.
   실행단계별 사용빈도를 추적할 수도 있다.
   쓰기 혹은 읽기 위주로 주로 사용되는 자료구조에 대해
   추적해서 별도 최적화할 수 있는 힌트를 제공한다.

3. 어떤 값의 변경을 컨트롤 할 수 있다.
   즉, setter를 쓰는 이상 [변경]은 더이상 존재하지 않는다.
   [변경 시도]가 존재할 뿐이다.
   이는 범위한정 등에서 유용하다.
   on_change event handler
   set_bound( min_constraints, max_constraints );
   와 같은 interface 를 활성화 할 수 있게 해 준다.

4. 어떤 값의 변경 결과를 시각화 할 수 있다.
   set_color( CL_RED );
   를 호출했을 때 해당 컨트롤의 색깔이 변해버리게 말이다.
   데이타의 변화와 시각화가 연동되는 엑셀과 같은 사용환경 구현이 가능하다.

5. getter는 실 메모리 사용량을 감소시킬 수 있다.
   left, top, right, bottom, width, height 와 같은 속성을 예로 들자면,
   right, bottom 혹은 width, height 멤버 변수만 갖고 있으면
   반대편을 계산가능 하다.
   auto get_right() { return  left + width; }
   auto get_width() { return  right - left; }
   처럼 말이다.
   어떤 값을 결정하는데 사용되는 복수개의 요인에 대해 통일된 접근을 제공한다.
   변경이 잦지만 정작 변경된 결과를 참조하는 회수가 적을 경우 성능도 높여준다.

6. property 확장 문법을 지원할 경우
   직관적으로 lvalue 또는 rvalue 의 사용이 가능하다.
   object.color = CL_RED; 가
   실제로는 object.set_color( CL_RED ); 가 호출되게 된다.
   cout << object.color; 역시
   실제로는 object.get_color(); 가 호출되게 된다.

낮잠 자다 일어나서 생각나는대로 끼적여봄.
