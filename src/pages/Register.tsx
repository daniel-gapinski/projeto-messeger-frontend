import Header from "../components/Header";
import Session from "../components/Session";
import Footer from "../components/Footer";
import FormRegisterBox from "../components/FormRegisterBox";
import { PageTitle } from "../components/PageTitle";

export default function Register() {

    return (
        <>
        <PageTitle title="Registre-se" />
            <Session>
                <Header></Header>
                <FormRegisterBox></FormRegisterBox>
                <Footer></Footer>
            </Session>

        </>
    )
}