let b:ale_linters = ['csslint', 'stylelint']
let b:ale_fixers = ['csslint', 'stylelint']

" format and sort a block (depends on christoomey/vim-sort-motion)
nmap g= mzviBgs=aB`z

setlocal foldlevelstart=99
setlocal foldmethod=marker
setlocal foldmarker={,}
