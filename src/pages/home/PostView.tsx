import { useAuth } from "../../AuthContext"
import PostForm from "./PostForm"
import axios from "axios"
import { API_URL } from "../../config"

export type Post = {
    id: number
    operand: number
    operator?: string | null
    username: string
    responses: Post[]
}

export interface PostProps {
    post: Post
    offset?: number
    previousResult?: number,
    onReply: () => Promise<void>
}

export default function PostView ({ post, offset = 0, previousResult, onReply }: PostProps) {
    const { auth } = useAuth();

    post = { ...post, operand: Number(post.operand) };
    const offsetFactor = 1;
    const left = offset * offsetFactor;

    let summary = '';
    let result = post.operand;

    if (previousResult !== undefined) {
        let validOperator = false;

        switch (post.operator) {
            case '+': {
                result = previousResult + post.operand;
                validOperator = true;
            } break;

            case '-': {
                result = previousResult - post.operand;
                validOperator = true;
            } break;

            case '*': {
                result = previousResult * post.operand;
                validOperator = true;
            } break;

            case '/': {
                result = previousResult / post.operand;
                validOperator = true;
            } break;
        }

        if (validOperator) {
            summary = `${previousResult} ${post.operator} ${post.operand}`;
        }
    }

    const usernameHighlight =
        auth.status === 'authenticated' && auth.username === post.username ?
            'text-emerald-400' : '';

    function validateReplyContents (contents: string): [string, number] {
        const operatorMatch = contents.match(/(?:^\s*)([+*/-])\s*(.*)$/);

        if (!operatorMatch || operatorMatch.length < 2) {
            throw new Error('Must start with one of the following operators + - * /');
        }

        const operator = operatorMatch[1];

        if (operatorMatch.length < 3) {
            throw new Error('No operand');
        }

        const operand = Number.parseFloat(operatorMatch[2]);
        if (Number.isNaN(operand)) {
            throw new Error('Operand must be a valid number');
        }

        return [operator, operand];
    }

    const handleReplyPublish = (accessToken: string) => async function (contents: string) {
        const [operator, operand] = validateReplyContents(contents);

        await axios.post(
            `${API_URL}/posts/`,
            { operator, operand, parentPostId: post.id },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (onReply) {
            await onReply();
        }
    }

    return (
        <>
            <div
                className="p-4 bg-zinc-600 rounded-sm shadow-md"
                style={{ marginLeft: `${left}rem` }}
            >
                <p className={`text-base ${usernameHighlight}`}>{post.username}</p>
                <p className="text-xs text-zinc-300">{summary}</p>
                <p className="text-xl py-2">{result}</p>
                {auth.status === 'authenticated' &&
                    <PostForm toggleText="Reply" onPublish={handleReplyPublish(auth.token)} />
                }
            </div>
            {post.responses.map(r =>
                <PostView
                    key={r.id}
                    post={r}
                    offset={offset + 1}
                    previousResult={result}
                    onReply={onReply}
                />
            )}
        </>
    );
}
