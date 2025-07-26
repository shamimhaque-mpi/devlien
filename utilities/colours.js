const colours = {
    success : '\x1b[32m%s\x1b[0m',
    warning : '\x1b[33m%s\x1b[0m',
    error   : '\x1b[31m%s\x1b[0m',
    info    : '\x1b[36m%s\x1b[0m',
    secondary : '\x1b[36m%s\x1b[0m',
    //
    text:(text, type='info')=>{
        return colours[type]?.replace('%s', text)
    }
}

export default colours;