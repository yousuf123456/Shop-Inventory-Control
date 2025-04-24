// "use server";

// import auth0 from "../_libs/auth0";

// export const getUserAuth = async () => {
//   try {
//     const session = await auth0.getSession();

//     if (!session) return { isAuthenticated: false, user: null };

//     if (session.user) {
//       return { user: session.user, isAuthenticated: true };
//     }

//     return { isAuthenticated: false, user: null };
//   } catch {
//     return { isAuthenticated: false, user: null };
//   }
// };
