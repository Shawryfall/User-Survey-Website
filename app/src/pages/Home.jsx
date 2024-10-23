import Comment from '/src/components/Comment';
/**
 * @author Patrick Shaw
 */
function Home() {
    return (
        <>
            <header className="text-center my-4">
                <h2 className="text-2xl font-bold my-2">Home</h2>
                <h3 className="text-xl font-medium">Welcome to this survey website, for sentitment of AI in the workplace!</h3>
            </header>
            <section className="text-left ml-0 space-y-2">
                <h4 className="text-base flex justify-center items-center -ml-60">
                    Users comments on AI in the workplace:</h4>
                <Comment />
            </section>
            <div className="max-w-lg mx-auto my-4">
                <h5 className="text-xl font-medium">
                    On this website you can take part in our survey or view previously collected data.
                    Make sure to sign in or create an account to enjoy full functionality.
                </h5>
            </div>
        </>
    )
}

export default Home;
