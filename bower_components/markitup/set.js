// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2011 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------
// Html tags
// http://en.wikipedia.org/wiki/html
// ----------------------------------------------------------------------------
// Basic set. Feel free to add more tags
// ----------------------------------------------------------------------------
var ifHasMark,
  gsReplaceFun = function(gs){
  if(ifHasMark){
    return gs;
  }
  else{
    return '#$' + gs + '$#';
  }
};
function matheq_preview() {
  $('#prevDoc').html($('.formulaEditTiGan').val());
  $('#prevTiZhiDoc').html($('.formulaEditTiZhi').val());
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, "prevDoc"]);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, "prevTiZhiDoc"]);
}
var mySettings = {
  nameSpace:       "mktEditor",
  onShiftEnter:    {keepDefault:false, replaceWith:'<br />\n'},
  onCtrlEnter:    {keepDefault:false, openWith:'\n<p>', closeWith:'</p>'},
  onTab:        {keepDefault:false, replaceWith:''},
  resizeHandle: false,
  beforeInsert:function(h) {
    var textVal = $('.markItUpEditor').val(),
      myPst = h.caretPosition,
      beforeTxt = textVal.slice(0, myPst),
      afterTxt = textVal.slice(myPst),
      beforeMark,
      afterMark;
    beforeMark = beforeTxt.lastIndexOf('#$');
    afterMark = afterTxt.indexOf('$#');
    if(beforeMark >= 0 && afterMark >= 0){
      ifHasMark = true;
    }
    else{
      ifHasMark = false;
    }
  },
  afterInsert:function() {
    matheq_preview();
  },
  markupSet:[
    {name:'a01', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dfrac{b}{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\frac{b}{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqrt{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqrt[b]{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('{a}^{b}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('{a}_{b}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('{a}_{c}^{b}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('_{c}^{b}{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\overset{b}{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\underset{b}{a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mathop{a}\\limits_{b}^{c}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\begin{array}{}{a}\\\\{b}\\end{array}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\overline{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\underline{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\overleftarrow{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\overrightarrow{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\widetilde{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\widehat{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\overbrace{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\underbrace{abc}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mathbb{A}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mathbf{B}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mathcal{C}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mathfrak{D}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\hat{e}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\check{f}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\breve{g}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\acute{h}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\grave{k}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\tilde{l}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bar{m}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vec{n}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dot{o}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ddot{p}');
      }}
    ]},
    {name:'a02', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('+');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('-');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\times');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\div');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\pm');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mp');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('/');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\backslash');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cdot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bullet');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\circ');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigcirc');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\star');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ast');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vee');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\wedge');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\oplus');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ominus');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\otimes');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\odot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\boxplus');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\boxminus');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\boxtimes');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\boxdot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigtriangleup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigtriangledown');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\triangleleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\triangleright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\wr');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\diamond');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dagger');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ddagger');
      }}
    ]},
    {name:'a03', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('=');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\neq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\approx');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\equiv');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lt');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gt');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leqslant');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\geqslant');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ll');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gg');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\geq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\prec');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\succ');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\preceq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\succeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\backsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\simeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\backsimeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\doteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\circeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\triangleq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cong');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\smile');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\frown');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\propto');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bowtie');
      }}
    ]},
    {name:'a04', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\geqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\eqslantless');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\eqslantgtr');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lesssim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gtrsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lessapprox');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gtrapprox');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lessdot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gtrdot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lll');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ggg');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lessgtr');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gtrless');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lesseqgtr');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gtreqless');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\risingdotseq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\fallingdotseq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\doteqdot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\eqcirc');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\preccurlyeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\succcurlyeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\curlyeqprec');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\curlyeqsucc');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vartriangleleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vartriangleright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\trianglelefteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\trianglerighteq');
      }}
    ]},
    {name:'a05', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nless');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ngtr');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nleqslant');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ngeqslant');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nleqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ngeqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nleq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ngeq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lneq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gneq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lneqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gneqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lnsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gnsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lnapprox');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gnapprox');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ncong');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nprec');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsucc');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\npreceq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsucceq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\precneqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\succneqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\precnsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\succnsim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\precnapprox');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\succnapprox');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ntriangleleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ntriangleright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ntrianglelefteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ntrianglerighteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nshortmid');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nshortparallel');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nmid');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nparallel');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nvdash');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nvDash');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nVdash');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nVDash');
      }}
    ]},
    {name:'a06', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\because');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\therefore');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\forall');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\exists');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\neg');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\surd');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\top');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ldots');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cdots');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vdots');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ddots');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\infty');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\partial');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nabla');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\triangle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\aleph');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\hbar');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\imath');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\jmath');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ell');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\wp');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Re');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Im');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\S');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\divideontimes');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\prime');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\backprime');
      }}
    ]},
    {name:'a07', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\subset ');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\supset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\subseteq ');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\supseteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\in');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ni');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cap');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Cap');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Cup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Subset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Supset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqsubseteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqsupseteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqsubset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqsupset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\subseteqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\supseteqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqcap');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqcup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vee');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\wedge');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\emptyset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\varnothing');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\not\\subset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\not\\supset');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsubseteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsupseteq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\notin');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\not\\ni');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsubseteqq');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nsupseteqq');
      }}
    ]},
    {name:'a08', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('(');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun(')');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('[');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun(']');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\{');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\langle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rangle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lfloor');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rceil');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lceil');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rfloor');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('/');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\backslash');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('|');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\|');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\right');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\begin');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\end');
      }}
    ]},
    {name:'a09', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Leftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Rightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightharpoonup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightharpoondown');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftharpoonup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftharpoondown');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Leftrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightleftharpoons');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftrightharpoons');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\uparrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Uparrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\downarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Downarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\updownarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Updownarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\hookrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\hookleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftleftarrows');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightrightarrows');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftrightarrows');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightleftarrows');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Lleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Rrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftrightharpoons');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightleftharpoons');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\twoheadleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\twoheadrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\upuparrows');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\downdownarrows');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\upharpoonleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\upharpoonright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\downharpoonleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\downharpoonright');
      }}
    ]},
    {name:'a10', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nearrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\searrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nwarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\swarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\longrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\longleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\longleftrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\longmapsto');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Longrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Longleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Longleftrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\multimap');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Lsh');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Rsh');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftarrowtail');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightarrowtail');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\looparrowleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\looparrowright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\curvearrowleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\curvearrowright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\circlearrowleft');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\circlearrowright');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dashleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dashrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nleftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nleftrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rightsquigarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nLeftarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nRightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nLeftrightarrow');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\leftrightsquigarrow');
      }}
    ]},
    {name:'a11', className:'width70 wh70x35', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sin');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cos');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\arcsin');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\tan');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\arccos');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sec');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\csc');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\arctan');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sinh');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\cosh');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\tanh');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\coth');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lg');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ln');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\log');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\max');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\min');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\arg');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ker');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\det');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\exp');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\inf');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gcd');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\hom');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lim');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\liminf');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\limsup');
      }}
    ]},
    {name:'a12', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\alpha');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\beta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\gamma');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\delta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\epsilon');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\zeta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\eta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\theta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\iota');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\kappa');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lambda');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mu');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nu');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\xi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('o');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\pi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rho');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sigma');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\tau');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\upsilon');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\phi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\chi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\psi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\omega');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\varepsilon');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vartheta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\varpi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\varrho');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\varsigma');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\varphi');
      }}
    ]},
    {name:'a13', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm A');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm B');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Gamma');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Delta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm E');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm Z');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm H');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Theta');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm I');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm K');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Lambda');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm M');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm N');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Xi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm O');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Pi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm P');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Sigma');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm T');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Upsilon');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Phi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\rm X');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Psi');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Omega');
      }}
    ]},
    {name:'a14', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function() {
        return gsReplaceFun('\\sum');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\prod');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\coprod');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigsqcup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigcap');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigcup');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigvee');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigwedge');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigodot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigotimes');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\bigoplus');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\biguplus');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\int');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\iint');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\iiint');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\oint');
      }}
    ]},
    {name:'a15', className:'width70 wh105x70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left(\\begin{matrix}{a_{1}}&\\cdots&{a_{n}}\\end{matrix}\\right)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left(\\begin{matrix}{a_{1}}\\\\\\vdots\\\\{a_{n}}\\end{matrix}\\right)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left(\\begin{matrix}{a_{1}}& & \\\\ &\\ddots& \\\\ & &{a_{n}}\\end{matrix}\\right)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left(\\begin{matrix}{a_{11}}&{a_{12}}\\\\{a_{21}}&{a_{22}}\\end{matrix}\\right)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left[\\begin{matrix}{a_{11}}&{a_{12}}\\\\{a_{21}}&{a_{22}}\\end{matrix}\\right]');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left|\\begin{matrix}{a_{11}}&{a_{12}}\\\\{a_{21}}&{a_{22}}\\end{matrix}\\right|');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left(\\begin{matrix}{a_{11}}&{a_{12}}&{a_{13}}\\\\{a_{21}}&{a_{22}}&{a_{23}}\\\\{a_{31}}&{a_{32}}&{a_{33}}\\end{matrix}\\right)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left[\\begin{matrix}{a_{11}}&{a_{12}}&{a_{13}}\\\\{a_{21}}&{a_{22}}&{a_{23}}\\\\{a_{31}}&{a_{32}}&{a_{33}}\\end{matrix}\\right]');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left|\\begin{matrix}{a_{11}}&{a_{12}}&{a_{13}}\\\\{a_{21}}&{a_{22}}&{a_{23}}\\\\{a_{31}}&{a_{32}}&{a_{33}}\\end{matrix}\\right|');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left(\\begin{matrix}{a_{11}}&\\cdots&{a_{1n}}\\\\\\vdots&\\ddots&\\vdots\\\\{a_{m1}}&\\cdots&{a_{mn}}\\end{matrix}\\right)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left[\\begin{matrix}{a_{11}}&\\cdots&{a_{1n}}\\\\\\vdots&\\ddots&\\vdots\\\\{a_{m1}}&\\cdots&{a_{mn}}\\end{matrix}\\right]');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\left|\\begin{matrix}{a_{11}}&\\cdots&{a_{1n}}\\\\\\vdots&\\ddots&\\vdots\\\\{a_{m1}}&\\cdots&{a_{mn}}\\end{matrix}\\right|');
      }}
    ]},
    {name:'a16', className:'width70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\yen');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\circledR');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\checkmark');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\maltese');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\ulcorner');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\urcorner');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\llcorner');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lrcorner');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\mho');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\amalg');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\nexists');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\Game');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\flat');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\natural');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sharp');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\|');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\spadesuit');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\heartsuit');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\clubsuit');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\diamondsuit');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\angle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sphericalangle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\measuredangle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\odot');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\vartriangle');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\triangledown');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\square');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lozenge');
      }}
    ]},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\pi');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\to');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\infty');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\partial');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\lambda');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\ne');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\pm');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\cdot');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('~');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\\\');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('x^2');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('e^x');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\frac{1}{2}');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\sqrt{2}');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('f(x)');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('f\'(x)');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\dfrac{\\text{d}y}{\\text{d}x}');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\dfrac{\\Delta y}{\\Delta x}');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\dfrac{\\delta y}{\\delta x}');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\dfrac{\\partial y}{\\partial x}');
    }},
    {name:'', className:'', replaceWith: function(){
      return gsReplaceFun('\\{a_n\\}');
    }},
    {name:'大型公式', className:'width70 wh140x70', dropMenu: [
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sum\\limits_{i=1}^{n}a_{i}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqrt{a^2+b^2}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\sqrt{b^2-4ac}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\dfrac{-b\\pm\\sqrt{b^2 - 4ac}}{2a}');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\int f(x)\\text{d}x');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\int_a^bf(x)\\text{d}x');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('\\lim\\limits_{x\\to\\infty}f(x)');
      }},
      {name:'', className:'', replaceWith: function(){
        return gsReplaceFun('f(x)=\\left\\{\\begin{array}{}a\\\\b\\\\c\\end{array}\\begin{array}{},x>0\\\\,x=0\\\\,x<0\\end{array}\\right.');
      }}
    ]},
    {name:'媒体库',
      className:'width70 mediaLibrary',
      beforeInsert:function() {
        $("#mediaPlugin").toggle();
      }
    },
    {name:'增加个空', className:'width70 addBlank', replaceWith: ' <span>_____</span> '}
  ]
};
//var mySettingsTk = {
//  nameSpace:       "mktEditorTk", // Useful to prevent multi-instances CSS conflict
//  onShiftEnter:    {keepDefault:false, replaceWith:'<br />\n'},
//  onCtrlEnter:    {keepDefault:false, openWith:'\n<p>', closeWith:'</p>'},
//  onTab:        {keepDefault:false, replaceWith:'   '},
//  afterInsert:function() {
//    matheq_preview();
//  },
//  markupSet:[
//    {name:'增加个空', replaceWith: ' <span>_____</span> '}
//  ]
//};
