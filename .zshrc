precmd() {
   pwd=$(pwd)
   cwd=${pwd##*/}
   print -Pn "\e]0;$cwd\a"
}

preexec() {
   if overridden; then return; fi
   printf "\033]0;%s\a" "${1%% *} | $cwd"
}