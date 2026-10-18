(function(){
'use strict';
const amounts=Array.from(document.querySelectorAll('.amount-button'));
const customWrap=document.querySelector('.custom-amount'), customInput=document.getElementById('customAmount');
const tag=document.getElementById('impactTag'), title=document.getElementById('impactTitle'), desc=document.getElementById('impactDescription');
const bank=document.getElementById('bank-transfer'), transferAmount=document.getElementById('transferAmount'), toast=document.getElementById('toast');
let selected=5000, toastTimer;
const naira=n=>'₦'+Number(n).toLocaleString('en-NG');
function impact(n){
 if(n<=1000)return ['MEAL SUPPORT','Help provide a meal','Your contribution can help support food for a child or family.'];
 if(n<=2000)return ['BOOKS & PENS','Books and writing materials','Your contribution can help provide exercise books, pens and pencils.'];
 if(n<=5000)return ['SCHOOL SUPPLIES','School supplies for a child','Your contribution can help provide basic learning materials and useful school supplies.'];
 if(n<=10000)return ['BACK-TO-SCHOOL SUPPORT','A school bag and essentials','Your contribution can help provide a backpack and essential learning materials.'];
 if(n>=25000)return ['PROJECT SUPPORT','Support a DBOG initiative','Your contribution can support approved education, feeding or community projects.'];
 return ['YOUR CONTRIBUTION','Every gift can make a difference','Your contribution will support DBOG’s approved humanitarian projects.'];
}
function renderImpact(n,isCustom){
 const copy=impact(n);
 tag.textContent=(isCustom?'YOUR GIFT CAN HELP':naira(n)+' CAN HELP PROVIDE')+' · '+copy[0];
 title.textContent=copy[1]; desc.textContent=copy[2]; transferAmount.textContent=naira(n);
}
function setAmount(n,isCustom){
 selected=n;
 amounts.forEach(b=>{
  const active=isCustom ? b.dataset.amount==='custom' : b.dataset.amount===String(n);
  b.classList.toggle('selected',active); b.setAttribute('aria-pressed',active?'true':'false');
 });
 customWrap.hidden=!isCustom; renderImpact(n,isCustom); bank.hidden=true;
}
function showToast(message){
 toast.textContent=message; toast.classList.add('show'); clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);
}
amounts.forEach(button=>button.addEventListener('click',function(){
 if(button.dataset.amount==='custom'){setAmount(Math.max(0,Number(customInput.value)||0),true);customInput.focus();}
 else setAmount(Number(button.dataset.amount),false);
}));
customInput.addEventListener('input',function(){
 selected=Math.max(0,Number(customInput.value)||0); renderImpact(selected,true);
 amounts.forEach(b=>{const active=b.dataset.amount==='custom';b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active?'true':'false');});
 bank.hidden=true;
});
document.querySelectorAll('.impact-card').forEach(card=>card.addEventListener('click',function(){
 setAmount(Number(card.dataset.cardAmount),false);
 document.getElementById('amounts').scrollIntoView({behavior:'smooth',block:'start'});
}));
document.getElementById('continueButton').addEventListener('click',function(){
 if(!Number.isFinite(selected)||selected<100){
  showToast('Please choose an amount of at least ₦100.');
  if(customWrap.hidden)setAmount(1000,false);else customInput.focus();
  return;
 }
 renderImpact(selected,!customWrap.hidden); bank.hidden=false;
 bank.scrollIntoView({behavior:'smooth',block:'start'});
});
document.getElementById('changeAmount').addEventListener('click',function(){
 bank.hidden=true;document.getElementById('amounts').scrollIntoView({behavior:'smooth',block:'start'});
});
async function copyText(text){
 try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else throw new Error('clipboard unavailable');showToast('Copied to clipboard.');}
 catch(e){const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();let ok=false;try{ok=document.execCommand('copy');}catch(err){}area.remove();showToast(ok?'Copied to clipboard.':'Please copy the details manually.');}
}
document.getElementById('copyAccount').addEventListener('click',()=>copyText('5601482027'));
document.getElementById('copyAmount').addEventListener('click',()=>copyText(String(selected)));
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.navigation');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';}));
setAmount(5000,false);
})();