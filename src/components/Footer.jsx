function Footer() {

    return (
        <div>
            <br />
            <footer
                className="text-center text-secondary pt-3"
                style={{ borderTop: '1px solid gray', fontSize: '0.8rem' }}
            >
                <b style={{fontSize: '0.9rem' }}>
                    Designed and built by Varyaenn. Currently alpha v0.9.
                </b>
                <br/>
                <span>
                © 2025 LoL Team Manager is not endorsed by Riot Games.
                League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
                League of Legends © Riot Games, Inc.
                </span>
            </footer>
        </div>

    );
}

export default Footer