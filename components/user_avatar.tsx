import { auth } from "../auth"

export default async function UserAvatar() {
    const session = await auth()

    if (!session?.user || !session.user.image) return null;

    return (
        <div>
            <img src={session.user.image} alt={session.user.name ? `${session.user.name} Avatar` : "User Avatar"} />
        </div>
    )
}
