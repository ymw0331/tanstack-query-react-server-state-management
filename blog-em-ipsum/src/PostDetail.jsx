import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  // replace with useQuery
  // const data = [];
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 2000
  })

  if (isLoading)
    return <h3>Loading...</h3>

  if (isError)
    return <>
      <h3>Oops, something went wrong</h3>
      <p>{error.toString()}</p>
    </>

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>

      {/* Delete Button */}
      <button onClick={() => deleteMutation.mutate(post.id)} >Delete </button>

      {deleteMutation.isPending && (
        <p className="loading">Deleting the post...</p>
      )}

      {deleteMutation.isError &&
        <p className="error">Error deleting the post</p>
      }

      {deleteMutation.isSuccess && (
        <p className="success">Post was (not) deleted successfully</p>
      )}

      {/* Update Button */}
      <button
        onClick={() => updateMutation.mutate(post.id)}
      >Update title
      </button>

      {updateMutation.isPending && (
        <p className="loading">Updating the post...</p>
      )}

      {updateMutation.isError &&
        <p className="error">Error updating the post</p>
      }

      {updateMutation.isSuccess && (
        <p className="success">Title was (not) updated successfully</p>
      )}


      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}> {comment.email}: {comment.body} </li>
      ))}
    </>
  );
}
