# Express
__정글 7기 이유정 WEEK 13 나만무 준비 Express 공부 레포지__   

# Demo Link
http://bumkyulee.store/   

# 사용 Tools 
__Express.js__     
__MySQL__   
__DrawSQL__   
__Swaager__   

## 필수 요구 사항 및 추가 요구 사항 구현 완료   
1. 전체 게시글 목록 조회 API
    - 제목, 작성자명(nickname), 작성 날짜를 조회하기
    - 작성 날짜 기준으로 내림차순 정렬하기
2. 게시글 작성 API
    - 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
    - 제목, 작성 내용을 입력하기
3. 게시글 조회 API
    - 제목, 작성자명(nickname), 작성 날짜, 작성 내용을 조회하기 
4. 게시글 수정 API
    - 토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능
5. 게시글 삭제 API
    - 토큰을 검사하여, 해당 사용자가 작성한 게시글만 삭제 가능
6. 댓글 작성 API
    - 로그인 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 작성 가능
    - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
7. 댓글 수정 API
    - 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 수정 가능
    - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
8. 댓글 삭제 API
    - 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능
    - 원하는 댓글을 삭제하기   
## ERD   
![image](https://github.com/uuuuj/Express/assets/105343092/90173db4-7ae8-46ba-8f7e-429b6f580382)    

## API 명세
http://bumkyulee.store/api-docs   

# Git Issue & Project 활용하여 Git 협업 연습   
## Git Issue & Project
  
![image](https://github.com/uuuuj/Express/assets/105343092/21be6d41-b550-4c18-8925-cc4fb7694d53)   
