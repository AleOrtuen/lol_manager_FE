import logo from '../img/logo.png';
function Logo() {

    return(
        <div>
            <img src={logo} 
                style={{
                    // width: '30%', 
                    // height: '30%',
                    maxWidth: '350px',
                    marginBottom: '-40px',
                    marginTop: '-40px'
                }}
            />
        </div>
    )
}

export default Logo