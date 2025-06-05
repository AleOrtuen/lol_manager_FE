import logo from '../img/logo.png';

function Logo() {

    return(
        <div>
            <img src={logo} 
                style={{
                    maxWidth: '250px',
                    marginBottom: '-30px',
                    marginTop: '-30px'
                }}
            />
        </div>
    )
}

export default Logo