import{r as s,j as t}from"./index-Cl7xnBBD.js";import{a as o}from"./index-D0jinCwN.js";const y=()=>{const[a,r]=s.useState([]),[x,l]=s.useState(!0),[i,c]=s.useState(""),[u,h]=s.useState(""),[d,p]=s.useState(""),j=async()=>{try{const e=await o.get("http://3.111.163.2:8132/api/auths/");r(e.data),console.log(e),l(!1)}catch(e){console.error(e),l(!1)}};s.useEffect(()=>{j()},[]);const m=async()=>{try{const e=await o.post("http://3.111.163.2:8132/api/auths/website",{username:i,email:u,password:d});r([...a,e.data]),c(""),h(""),p("")}catch(e){console.error(e)}},f=async e=>{try{await o.delete(`http://3.111.163.2:8132/api/auths/${e}`),r(a.filter(n=>n._id!==e))}catch(n){console.error(n)}};return x?t.jsx("div",{children:"Loading..."}):a.length===0?t.jsx("div",{children:"No auths found."}):t.jsxs("div",{children:[t.jsx("h1",{children:"Auth List"}),t.jsx("ul",{children:a.map(e=>t.jsxs("li",{children:[t.jsx("span",{children:e.username}),t.jsx("button",{onClick:()=>f(e._id),children:"Delete"})]},e._id))}),t.jsx("input",{type:"text",value:i,onChange:e=>c(e.target.value),placeholder:"Username"}),t.jsx("input",{type:"text",value:u,onChange:e=>h(e.target.value),placeholder:"Email"}),t.jsx("input",{type:"password",value:d,onChange:e=>p(e.target.value),placeholder:"Password"}),t.jsx("button",{onClick:m,children:"Add Auth"})]})};export{y as default};
