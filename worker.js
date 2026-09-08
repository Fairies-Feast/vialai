/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
        var ask = request.url.replace("https://vialai.amsilla.workers.dev", "");
        if (ask.startsWith('/ask?')) {
            ask = decodeURIComponent(atob(ask.replace('/ask?', '')));
            var response1 = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
                messages: [{
                    role: "system",
                    content: "You are a helpful assistant known as VialAI.",
                }, {
                    role: "user",
                    content: ask,
                }, ],
                chat_template_kwargs: {
                    enable_thinking: false,
                },
            });
            var response2 = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
                messages: [{
                    role: "system",
                    content: "You are double-checking another LLM's work. Give feedback and things it could fix. Here was the original question: " + ask,
                }, {
                    role: "user",
                    content: response1['choices'][0]['message']['content'],
                }, ],
                chat_template_kwargs: {
                    enable_thinking: false,
                },
            });
            var response3 = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
                messages: [{
                    role: "system",
                    content: "You are a helpful assistant known as VialAI.",
                }, {
                    role: "user",
                    content: ask,
                }, {
                    role: "assistant",
                    content: response1['choices'][0]['message']['content']
                }, {
                    role: "system",
                    content: "Here is some feedback. DO NOT MENTION THIS IN THE RESPONSE, BECAUSE THE USER IS GOING TO LOOK AT THE RESPONSE. Please improve your message: " + response2['choices'][0]['message']['content']
                }, ],
                chat_template_kwargs: {
                    enable_thinking: false,
                },
            });
            return new Response(response3['choices'][0]['message']['content']);//['choices']);//[0]['message']['content']);
        } else {
            var html = `<!DOCTYPE html>
<html>
  <head>
    <title>VialAI</title>
    <!--link rel="stylesheet" href="/static/style.css" /-->
    <style>@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap");
      html {
        background: #224;
      }
      body {
        margin: 0;
        color: white;
        font-family: "Noto Sans", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
      /*body *:not(nav):not(nav *) {
        animation: fade-up 2s;
      }*/
      .banner * {
        animation: fade-up 2s forwards;
        opacity: 0;
      }
      @keyframes fade-up {
        0% {
          opacity: 0;
          top: 50%;
          position: relative;
        }
        100% {
          opacity: 1;
          top: 0%;
          position: relative;
        }
      }
      
      section {
        min-height: 100vh;
        background: black;
        padding: 10vw;
      }
      section h1 {
        font-size: 50px;
        margin-top: 0;
      }
      section.banner h1 {
        font-size: 50px;
      }
      section.banner {
        background: linear-gradient(#224, black);
      }
      
      .gradient {
        background: linear-gradient(90deg, deepskyblue, lightgreen);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .flex-box-parent {
        display: flex;
        width: fit-content;
        margin: auto;
      }
      .box {
        flex: 1;
        width: 25vw;
        aspect-ratio: 1 / 1;
        background: #111;
        border: #222 1px solid;
        display: flex;
        align-items: center;
        font-size: 50px;
        box-sizing: border-box;
      }
      .box svg {
        margin: auto;
      }
      .primary {
        background: #222;
        border: #333 1px solid;
        font-size: 15px;
        padding: 5%;
      }
      .msgbox {
        background: #335;
        padding: 10px;
        border-radius: 5px;
      }
      .msgbox textarea {
        outline: none;
        width: 100%;
        resize: none;
        background: transparent;
        border: none;
        box-sizing: border-box;
        color: white;
        font-family: "Noto Sans", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
      .msgbox textarea::placeholder {
        color: #dddddd;
      }
      .msgbox button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
      }
      
      nav {
        padding: 10px;
        display: flex;
        position: sticky;
        background: rgba(34, 34, 68, 0.3);
        backdrop-filter: blur(10px);
        top: 0;
        z-index: 1000;
      }
      .logo {
        display: flex;
        height: fit-content;
        align-items: center;
        font-size: 25px;
      }
      .logo h1 {
        flex: 1;
        margin: 0;
      }
      .logo img {
        flex: 1;
        margin: 5px;
        height: 35px;
      }
      nav .btncont {
        display: flex;
        align-items: center;
        width: fit-content;
        margin-left: auto;
      }
      nav .primary {
        border-radius: 100px;
        background: transparent;
        backdrop-filter: blur(10px);
        color: white;
        padding: 10px;
        border: white 1px solid;
        cursor: pointer;
      }
      .overlay-glass {
        position:fixed;
        top:150%;
        left:50%;
        transform:translate(-50%,-50%);
        width:fit-content;
        background:rgba(50,50,50,0);
        backdrop-filter:blur(10px);
        align-items:center;
        display:flex;
        padding:15px;
        border:#999 1px solid;
        border-radius:20px;
        box-shadow:0px 0px 20px grey;
        pointer-events:none;
        transition:0.5s;
        overflow:auto;
      }
      .overlay-glass.opened {
        opacity:1;
        pointer-events:auto;
        top:50%;
        background:rgba(50,50,50,0.3);
      }
      .overlay-glass.opened:hover {
        filter:brightness(110%);
        background:rgba(50,50,50,0.5);
        backdrop-filter:blur(20px);
        box-shadow:0px 0px 30px grey;
      }
      .overlay-glass button {
        cursor:pointer;
        background:rgba(255,255,255,0);
        border:white 1px solid;
        border-radius:100px;
        backdrop-filter:blur(20px);
        color:white;
        padding:10px;
        transition:0.5s;
      }
      .overlay-glass button:hover {
        background:rgba(255,255,255,0.1);
      }
      .loading {
        background:transparent;
        border:transparent 2px solid;
        border-top:white 2px solid;
        width:50px;
        height:50px;
        border-radius:100%;
        animation: spin 1s infinite;
        margin:auto;
      }
      @keyframes spin {
        0% {
          rotate:0deg;
        }
        100% {
          rotate:360deg;
        }
      }</style>
    <link rel="icon" type="image/x-icon" href="/static/favicon.png" />
    <script
      src="https://kit.fontawesome.com/c4d643d840.js"
      crossorigin="anonymous"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded",function(){
        var textbox = document.querySelector("#textbox");
var popup = document.querySelector("#popup");
var load = document.querySelector("#popup-load")
textbox.addEventListener("keydown",function(e){
    if (e.key == "Enter" && !e.shiftKey) {
        e.preventDefault();
        var text = textbox.value;
        load.classList.add("opened");
        fetch("https://vialai.amsilla.workers.dev/ask?" + btoa(encodeURIComponent(text)))
        .then(response => response.json())
        .then(data => {
            load.classList.remove("opened");
            popup.innerText = data;
            popup.classList.add("opened");
        })
        .catch(error => {
            load.classList.remove("opened");
            popup.innerHTML = "<h1>Something went wrong</h1>";
            popup.classList.add("opened");
        });
    }
})
      })
    </script>
    <!--script src='/static/script.js' defer></script-->
  </head>
  <body>
    <nav>
      <div class="logo"><img src="/static/favicon.png" />VialAI</div>
      <div class="btncont">
        <i class="fa-solid fa-info-circle"></i> For the GCC Labor Day Hackathon
      </div>
    </nav>
    <section class="banner">
      <h1>
        The AI Agent<br /><strong
          >That <span class="gradient">Checks Itself</span></strong
        >
      </h1>
      <p><i class="fa-solid fa-hat-wizard"></i> Ask me anything</p>
      <div class="msgbox">
        <textarea id='textbox' autofocus placeholder="Shift enter for newline"></textarea
        ><br />
        <button onclick='attemptSend();'><i class="fa-solid fa-message"></i></button>
      </div>
    </section>
    <section>
      <h1>How it works</h1>
      <div class="flex-box-parent">
        <div class="box"><i class="fa-solid fa-wand-sparkles"></i></div>
        <div class="box primary">Forward message to LLM</div>
      </div>
      <div class="flex-box-parent">
        <div class="box"><i class="fa-solid fa-circle-exclamation"></i></div>
        <div class="box primary">
          Create a new session and request it to find the issues
        </div>
      </div>
      <div class="flex-box-parent">
        <div class="box"><i class="fa-solid fa-wrench"></i></div>
        <div class="box primary">
          Ask the original session to fix the issues
        </div>
      </div>
      <div class="flex-box-parent">
        <div class="box"><i class="fa-solid fa-repeat"></i></div>
        <div class="box primary">Repeat until correct</div>
      </div>
    </section>
    <div class='overlay-glass' id='popup-load'>
      <div>
        <div class='loading'></div>
      </div>
    </div>
    <div class='overlay-glass' id='popup'></div>
  </body>
</html>

`;
            return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
        }
    }
};
