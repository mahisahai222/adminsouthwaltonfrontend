import{r as o,_ as N,R as y,a as v,c as w,P as p,i as L,j as s,L as b}from"./index-Cl7xnBBD.js";import{a as k}from"./index-D0jinCwN.js";import{C as A,a as x}from"./index.es-BP4VkgRa.js";import{C as h,a as l,b as u}from"./CRow-BQ3vXC-k.js";import{C as E,a as I,b as R}from"./CForm-DW9Ba5Xm.js";import{C as g,a as j}from"./CInputGroupText-kiadrm-P.js";import{c as V}from"./cil-lock-locked-DmxpJbVL.js";import{a as C}from"./CButton-DIE8Mt07.js";var n=o.forwardRef(function(e,r){var c=e.children,t=e.className,i=N(e,["children","className"]);return y.createElement("div",v({className:w("card-group",t)},i,{ref:r}),c)});n.propTypes={children:p.node,className:p.string};n.displayName="CCardGroup";var G=["512 512","<path fill='var(--ci-primary-color, currentColor)' d='M411.6,343.656l-72.823-47.334,27.455-50.334A80.23,80.23,0,0,0,376,207.681V128a112,112,0,0,0-224,0v79.681a80.236,80.236,0,0,0,9.768,38.308l27.455,50.333L116.4,343.656A79.725,79.725,0,0,0,80,410.732V496H448V410.732A79.727,79.727,0,0,0,411.6,343.656ZM416,464H112V410.732a47.836,47.836,0,0,1,21.841-40.246l97.66-63.479-41.64-76.341A48.146,48.146,0,0,1,184,207.681V128a80,80,0,0,1,160,0v79.681a48.146,48.146,0,0,1-5.861,22.985L296.5,307.007l97.662,63.479h0A47.836,47.836,0,0,1,416,410.732Z' class='ci-primary'/>"];const U=()=>{const e=L(),[r,c]=o.useState(""),[t,i]=o.useState(""),[d,m]=o.useState(""),f=async()=>{try{const a=await k.post("http://3.111.163.2:8132/api/auths/Login",{email:r,password:t});m(a.data.message),a.status===200&&e("/UserManageList")}catch{m("Login failed")}};return s.jsxs("div",{className:"bg-body-tertiary min-vh-100 d-flex flex-row align-items-center",children:[s.jsx("style",{children:`
          .login-card {
            width: 100%;
            max-width: 450px; /* Adjust this value to change the card width */
            margin: auto;
          }

          .text-primary {
            color: #007bff;
          }

          .text-muted {
            color: #6c757d;
          }

          .text-danger {
            color: #dc3545;
          }

          .bg-body-tertiary {
            background-color: #f8f9fa;
          }
        `}),s.jsx(A,{children:s.jsx(h,{className:"justify-content-center",children:s.jsx(l,{md:6,children:s.jsx(n,{children:s.jsx(E,{className:"p-4 login-card",children:s.jsx(I,{children:s.jsxs(R,{children:[s.jsx("h1",{className:"text-primary",children:"Login"}),s.jsx("p",{className:"text-muted",children:"Sign In to your account"}),s.jsxs(g,{className:"mb-3",children:[s.jsx(j,{children:s.jsx(x,{icon:G})}),s.jsx(u,{placeholder:"Email",autoComplete:"email",value:r,onChange:a=>c(a.target.value)})]}),s.jsxs(g,{className:"mb-4",children:[s.jsx(j,{children:s.jsx(x,{icon:V})}),s.jsx(u,{type:"password",placeholder:"Password",autoComplete:"current-password",value:t,onChange:a=>i(a.target.value)})]}),s.jsxs(h,{children:[s.jsx(l,{xs:6,children:s.jsx(C,{color:"success",variant:"outline",className:"px-4",onClick:f,children:"Login"})}),s.jsx(l,{xs:6,className:"text-right",children:s.jsx(b,{to:"/forgot-password-request",children:s.jsx(C,{color:"link",className:"px-0",children:"Forgot password?"})})})]}),d&&s.jsx("p",{className:"text-danger mt-3",children:d})]})})})})})})})]})};export{U as default};
