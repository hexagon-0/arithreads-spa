import { ChangeEvent, FormEvent, useState } from "react";
import { API_URL } from "../../config";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useErrorList } from "../../components/ErrorList";

export default function LoginPage () {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const { setErrors, ErrorList } = useErrorList();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inFlight, setInFlight] = useState(false);

    function handleUsernameChange (e: ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function handlePasswordChange (e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    async function handleFormSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setInFlight(true);

        async function makeRequest () {
            const url = `${API_URL}/users/login`;

            try {
                const response = await axios.post(url, { username, password });
                const token: string = response.data.accessToken;
                setAuth({ status: 'authenticated', username, token });
                navigate('/');
            } catch (err) {
                console.error(err);

                if (err instanceof AxiosError && Array.isArray(err.response?.data)) {
                    setErrors(err.response.data);
                }
            } finally {
                setInFlight(false);
            }
        }

        makeRequest();
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-zinc-800 text-zinc-100">
            <div className="space-y-4 p-2 rounded-md bg-zinc-600 shadow-lg md:min-w-60">
                <form className="space-y-2" onSubmit={handleFormSubmit}>
                    <div className="flex justify-between flex-col md:flex-row">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            className="rounded-md px-2 bg-zinc-800"
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            disabled={inFlight}
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex justify-between flex-col md:flex-row">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            className="rounded-md px-2 bg-zinc-800"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            disabled={inFlight}
                        />
                    </div>

                    <button
                        className="w-full bg-emerald-400 text-zinc-900 rounded-md py-2"
                        disabled={inFlight}
                    >
                        {inFlight ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="flex justify-between">
                    <Link to={import.meta.env.BASE_URL} className="rounded-md px-2 py-1 bg-gray-400 text-zinc-900">
                        Back
                    </Link>

                    <Link to={import.meta.env.BASE_URL + 'register'} className="rounded-md px-2 py-1 bg-gray-400 text-zinc-900">
                        Register
                    </Link>
                </div>

                <ErrorList />
            </div>
        </div>
    );
}
