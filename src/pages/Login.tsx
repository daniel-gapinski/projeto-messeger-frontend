import Header from "../components/Header";
import FormBox from "../components/FormLoginBox";
import Session from "../components/Session";
import Footer from "../components/Footer";
import { PageTitle } from "../components/PageTitle";

export default function Login() {

    return (
        <>
        <PageTitle title="Entrar" />
            <Session>
                <Header></Header>
                <FormBox></FormBox>
                <Footer></Footer>
            </Session>
        </>
    )
}