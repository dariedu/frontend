import NavigationBar from '../../components/NavigationBar/NavigationBar';
// import StoriesView from '../../components/SliderStories/SliderStories';
import TabBar from '../../components/TabBar/TabBar';


const VolunteerPage = () => {
  return (
    <div>
      <NavigationBar variant ="mainScreen"  title = ''  avatarUrl = ''/>
      {/* <img
        className="w-[130px] h-[26px] absolute top-0 left-0"
        src="./src/assets/icons/mainLogo.gif"
      />
       <img
          className="w-[130px] h-[26px] relative"
          src="./src/assets/icons/mainLogo.png"
        />   */}
     
      {/* <StoriesView /> */}
  
      <TabBar userRole="volunteer"/>
    </div>
  );
};

export default VolunteerPage;
