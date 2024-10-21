import FormCreateContact from "../../../components/CreateContact"
import ListAbout from "../../../components/ListAbout"

const ContactPage = () => {
    return (
        <section className="bg-gray-100">
            <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <section className="py-16 bg-gray-100 font-poppins dark:bg-gray-900">
                    <div className="justify-center flex-1 max-w-5xl px-4 py-4 mx-auto lg:py-10 md:px-7">
                        <ListAbout />
                        <FormCreateContact />
                    </div>
                </section>
            </div>
        </section>
    )
}

export default ContactPage