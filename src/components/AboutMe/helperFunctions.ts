import { IUser } from '../../core/types';
import {
  // metier,
  patchUser
} from '../../api/userApi';


async function handleRequestSubmit(metierName: string | number, requestBody: { about_me: string }, userId: number | undefined, token: string | null, userValue: { currentUser: IUser|null }, setButtonActive:React.Dispatch<React.SetStateAction<boolean>>, setRequestAboutMeSuccess:React.Dispatch<React.SetStateAction<boolean>>, setRequestAboutMeFail:React.Dispatch<React.SetStateAction<boolean>>) {

    const requestObject:Partial<IUser> = {
      metier: metierName as string,
      interests: requestBody.about_me,
 } 
      try {
          if (userId && token) {
        const response = await patchUser(userId, requestObject, token)
            if (response) {
              if (userValue.currentUser) {
                userValue.currentUser.metier = metierName as string;
                userValue.currentUser.interests = requestBody.about_me
              }
          requestBody.about_me = "";
          localStorage.removeItem("about_me");
          setButtonActive(false)
          setRequestAboutMeSuccess(true)
            }
        }else{
      setRequestAboutMeFail(true)
  }
      } catch (err) {
        setRequestAboutMeFail(true)
        console.log(err, "handleRequestSubmit aboutMe")
      }
}
    
export {handleRequestSubmit}