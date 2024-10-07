interface TextInputProps {
    text: string
}

const TextInput = (props: TextInputProps) => {
    const {text} = props
    return (
    <div className="bg-background-100">
        <p className="foreground">{text}</p>
    </div>)
}

export default TextInput