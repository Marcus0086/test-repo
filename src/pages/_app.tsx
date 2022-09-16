import '../stylesheets/global.scss';
import {EngageXProvider} from "../core";

export default ({Component, pageProps}) => {
    return (
        <EngageXProvider>
            <Component {...pageProps} />
        </EngageXProvider>
    );
};