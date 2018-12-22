# AdunDocs

![](http://adundocs.xyz/upload/1480492899adundocslogo.png)

**AdunDocs** : 블로그연동과 마크다운을 지원하며, DB가 필요 없는 오픈형 문서 노트  

Live demo: <http://oppacoding.dothome.co.kr/docs>

### Features

1. 복잡한 DB 설정이 필요없습니다.
    - 모든 파일은 로컬 DB에 저장됩니다.(nedb)
    - 그러므로 복잡한 DB세팅이 필요 없습니다.

2. MarkDown을 지원합니다.
    - Markdown은 HTML로 변환이 가능한 경량화된 마크업 언어입니다.
    - 이를 이용해서 쉽게 문서들을 편집할 수 있습니다.
    - 물론 HTML에디터도 사용 가능합니다.
  
3. 블로그와 연동 가능합니다.
    - AdunDocs에서는 블로그의 포스트를 편집할 수 있습니다.
    - MarkDown 문법을 이용한 편집기능도 제공합니다.
  
- 지원하는 블로그  

|  Blog | Features   |
| ------------ | ------------ |
|Tistory   |getUsersBlogs, getRecentPosts, getCategories, getPost, editPost, newPost, deletePost, newMediaObject   |
|  Naver | getUsersBlogs, getRecentPosts, getCategories, getPost, editPost, newPost, deletePost, newMediaObject  |

------------
![](http://adundocs.xyz/upload/1480492062adundocs.PNG)
![](http://adundocs.xyz/upload/1480491977adundocs2.PNG)
![](http://adundocs.xyz/upload/1480491990adundocs3.PNG)


### getting started
```
https://github.com/adunStudio/AdunDocs.git
npm install
make js file --> adundocs/server/secret.js
```

```
// secret.js
module.exports = {
    pattern     : '123',

    admin       : 'string',

    cookieSecret: 'string'
};
```

```
node server.js
```



### License

The GPLv2 License.

Copyright (c) 2016 AdunStudio
