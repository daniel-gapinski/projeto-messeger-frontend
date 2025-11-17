import Container from "./Container"

export default function Footer() {

    return (
        <>
            <div className="w-full bg-white h-16 flex">
                <Container>
                    <div className="w-full h-full flex items-center justify-between text-gray">
                        <small>ChatDesk&reg;</small>
                        <small>2025</small>
                    </div>
                </Container>
            </div>
        </>
    )
}