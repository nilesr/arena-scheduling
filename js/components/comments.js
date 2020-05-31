class Inputs extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div><input className="search" name="subject" key="search" value={this.props.subject} placeholder="Subject" onChange={this.props.onChange}></input>
            <textarea key="message" name="message" value={this.props.message} placeholder="A message..." style={{height: '200px'}} onChange={this.props.onChange}></textarea>
            <input type="submit" className="submit"></input></div>
    }
}

class Comments extends React.Component {

    constructor(props) {
        super(props)
        var p = props.comments.length > 0 ? props.comments[0] : {subject: "", message: ""}

        this.state = {
            subject: p.subject,
            message: p.message,
            sending: false,
            errMsg: null,
            succMsg: null
        }


        this.onChange = this.onChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    
    onChange(e) {
        let {name, value} = e.target;
        this.setState({
            [name]: value
        });
    }
    

    handleSubmit(e) {
        e.preventDefault()

        this.setState({
            ...this.state, succMsg: null, errMsg: null, sending: false
        }, () => {
            if (this.state.subject.length == 0) {
                this.setState({...this.state, errMsg: 'Please add a subject'})
                return;
            }
            
            if (this.state.message.length == 0) {
                this.setState({...this.state, errMsg: 'Please add a message'})
                return;
            }
    
            this.setState({...this.state, sending: true}, () => {
                
                put("/comment", {
                    subject: this.state.subject,
                    message: this.state.message
                }, () => {

                    this.setState({
                        ...this.state,
                        sending: false,
                        succMsg: 'Comment submitted!'
                    })
                    this.props.onChange();

                }, (t) => {
                    this.setState({
                        ...this.state,
                        sending: false,
                        errMsg: t
                    })

                })
            })
        })

        
    }

    render() {

        return <div style={{marginLeft: '10%', marginRight: '10%', marginTop: '2%', width: '60%'}}>
        <h3 style={{textAlign: 'center'}}>Problem? - Send Casey a message.</h3>
        {this.state.errMsg ? <Alert variant="danger">{this.state.errMsg}</Alert> : null }
        {this.state.sending ? <Alert variant="primary">Sending...</Alert> : null }
        {this.state.succMsg ? <Alert variant="success">{this.state.succMsg}</Alert> : null }
        <form style={{marginTop: '2%'}} onSubmit={this.handleSubmit}>
            <Inputs onChange={this.onChange} subject={this.state.subject} message={this.state.message}></Inputs>
        </form>
        </div>
    }
}

window.Comments = Comments
