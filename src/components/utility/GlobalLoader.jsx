import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function GlobalLoader() {

    // const isLoading = useSelector((state) => state.loading.isLoading);

    // if (!isLoading) return null;

      const isLoading = useSelector((state) => state.loading.isLoading);
      const [visible, setVisible] = useState(false);
      const [timer, setTimer] = useState(null);

      useEffect(() => {
        if (isLoading) {
          const newTimer = setTimeout(() => setVisible(true), 1000);
          setTimer(newTimer);
        } else {
          clearTimeout(timer);
          setVisible(false);
        }
        return () => clearTimeout(timer);
      }, [isLoading]);

      if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: 9999
        }}>
            <div
                className="spinner-border"
                style={{
                    width: '5rem',
                    height: '5rem',
                    border: '0.5em solid #ccc',
                    borderTop: '0.5em solid #333',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
                role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

}

export default GlobalLoader;