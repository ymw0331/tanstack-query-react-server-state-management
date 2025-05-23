import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // Mutation need no queryKey
  // Post Delete
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId)
  })

  // Post Update
  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId)
  })

  // deleteMutation.mutate(selectedPost.id)

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])


  // Posts Listing
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // 2 seconds
  });



  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={
              () => {
                deleteMutation.reset()
                updateMutation.reset()
                setSelectedPost(post)
              }
            }
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage < 1}
          onClick={() => { setCurrentPage((previousPage) => previousPage - 1) }}>
          Previous page
        </button>

        <span>Page {currentPage + 1}</span>

        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => { setCurrentPage((previousPage) => previousPage + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {
        selectedPost &&
        (<PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />)
      }
    </>
  );
}
