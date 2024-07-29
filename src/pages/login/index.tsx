import { FormEvent } from "react";

export default function LoginPage () {
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-zinc-900 text-zinc-300">
            <div className="shadow-sm py-2 px-3 w-96">
                <form className="space-y-2" onSubmit={handleFormSubmit}>
                    <div className="flex justify-between">
                        <label>Username:</label>
                        <input className="rounded-md px-2" type="text" />
                    </div>

                    <div className="flex justify-between">
                        <label>Password:</label>
                        <input className="rounded-md px-2" type="password" />
                    </div>

                    <button className="w-full bg-emerald-400 text-zinc-900 rounded-md py-2">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
