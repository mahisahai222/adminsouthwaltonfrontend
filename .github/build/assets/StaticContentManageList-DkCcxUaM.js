import{r as c,j as t}from"./index-Cl7xnBBD.js";import{a as i}from"./index-D0jinCwN.js";const h=()=>{const[a,e]=c.useState(""),[o,s]=c.useState(""),r=async()=>{try{const n=await i.post("http://localhost:5000/api/StaticContentManageData/StaticContent",{policy:a,termsandconditions:o});console.log("New static content added:",n.data),e(""),s("")}catch(n){console.error("Error adding static content:",n)}},d=async()=>{try{const l=await i.put("http://localhost:5000/api/StaticContentManageData/your_static_content_id",{policy:a,termsandconditions:o});console.log("Static content updated:",l.data),e(""),s("")}catch(n){console.error("Error updating static content:",n)}};return t.jsxs("div",{className:"static-content-manage",children:[t.jsx("h1",{children:"Static Content Management"}),t.jsxs("div",{className:"input-container",children:[t.jsx("label",{htmlFor:"policy",children:"Policy:"}),t.jsx("input",{type:"text",id:"policy",value:a,onChange:n=>e(n.target.value)})]}),t.jsxs("div",{className:"input-container",children:[t.jsx("label",{htmlFor:"termsandconditions",children:"Terms and Conditions:"}),t.jsx("input",{type:"text",id:"termsandconditions",value:o,onChange:n=>s(n.target.value)})]}),t.jsxs("div",{className:"button-container",children:[t.jsx("button",{className:"add-button",onClick:r,children:"Add Static Content"}),t.jsx("button",{className:"update-button",onClick:d,children:"Update Static Content"})]})]})};export{h as default};
